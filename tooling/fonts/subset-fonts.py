"""Regenerate and verify the vendored Inter subsets; normal builds need no Python."""
import argparse
import hashlib
import importlib.metadata
import json
import math
from pathlib import Path
import sys

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--tools-dir', type=Path, help='Explicit directory containing the pinned Python tools')
args = parser.parse_args()
if args.tools_dir:
    sys.path.insert(0, str(args.tools_dir.resolve()))

from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

directory = Path(__file__).resolve().parents[2] / 'packages/core/assets/inter'
manifest = json.loads((directory / 'manifest.json').read_text(encoding='utf-8'))
config = json.loads((directory / manifest['subset']).read_text(encoding='utf-8'))
for package, version in config['tools'].items():
    assert importlib.metadata.version(package) == version, f'{package} must be {version}'

requested = set()
for value in config['unicodeRanges']:
    ends = value.split('-')
    start, end = int(ends[0], 16), int(ends[-1], 16)
    requested.update(range(start, end + 1))

required = 'ĂăÂâÎîȘșȚțŞşŢţ\u0302\u0306\u0326€„”–—0123456789'
sample = 'ĂăÂâÎîȘșȚțŞşŢţAaSsTtȚârgu Mureș Dâmbovița Brașov 0123456789€'

def sha256(data):
    return hashlib.sha256(data).hexdigest()

def geometry_delta(first, second):
    if isinstance(first, (int, float)) and isinstance(second, (int, float)):
        return abs(first - second)
    if isinstance(first, (list, tuple)) and isinstance(second, (list, tuple)):
        assert len(first) == len(second), 'Glyph contour topology changed'
        return max((geometry_delta(a, b) for a, b in zip(first, second)), default=0)
    assert first == second, 'Glyph drawing operation changed'
    return 0

def verify(original, optimized, keep):
    source_map, target_map = original.getBestCmap(), optimized.getBestCmap()
    assert set(target_map) == keep, 'Subset character coverage differs from its profile'
    assert all(ord(char) in target_map for char in required), 'Romanian characters or combining marks missing'
    axes = {axis.axisTag: [axis.minValue, axis.maxValue] for axis in optimized['fvar'].axes}
    assert axes == {'opsz': manifest['opticalSizeRange'], 'wght': config['weightRange']}, axes
    for table, fields in {'hhea': ['ascent', 'descent', 'lineGap'], 'OS/2': ['sTypoAscender', 'sTypoDescender', 'sTypoLineGap', 'sCapHeight', 'sxHeight', 'usWinAscent', 'usWinDescent']}.items():
        for field in fields:
            assert getattr(original[table], field) == getattr(optimized[table], field), (table, field)
    assert original['post'].italicAngle == optimized['post'].italicAngle
    for point in keep:
        assert original['hmtx'][source_map[point]] == optimized['hmtx'][target_map[point]], point
    features = {record.FeatureTag for record in optimized['GSUB'].table.FeatureList.FeatureRecord}
    assert {'tnum', 'zero', 'ss02', 'calt', 'dlig', 'pnum'} <= features
    compared = 0
    maximum_delta = 0
    for weight in [400, 600, 650, 700, 750]:
        for optical_size in [14, 18, 32]:
            location = {'wght': weight, 'opsz': optical_size}
            before, after = original.getGlyphSet(location=location), optimized.getGlyphSet(location=location)
            for char in set(sample):
                source_glyph, target_glyph = before[source_map[ord(char)]], after[target_map[ord(char)]]
                assert math.isclose(source_glyph.width, target_glyph.width, abs_tol=1), char
                source_pen, target_pen = DecomposingRecordingPen(before), DecomposingRecordingPen(after)
                source_glyph.draw(source_pen)
                target_glyph.draw(target_pen)
                delta = geometry_delta(source_pen.value, target_pen.value)
                # Partial-variable instancing rounds deltas: 2/2048 em is 0.0625px at 64px.
                assert delta <= 2, (char, weight, optical_size, delta)
                maximum_delta = max(maximum_delta, delta)
                compared += 1
    return {'characters': len(target_map), 'glyphs': len(optimized.getGlyphOrder()), 'axes': axes, 'outlineComparisons': compared, 'maximumOutlineDeltaFontUnits': maximum_delta, 'maximumToleranceFontUnits': 2, 'romanianAndCombiningMarks': True, 'hinting': 'preserved'}

reports = []
for face in manifest['faces']:
    source_path, target_path = directory / face['sourceFile'], directory / face['file']
    source_bytes = source_path.read_bytes()
    assert sha256(source_bytes) == face['sourceSha256'], 'Upstream font hash changed'
    original = TTFont(source_path, recalcTimestamp=False)
    font = TTFont(source_path, recalcTimestamp=False)
    keep = set(original.getBestCmap()) & requested
    options = subset.Options()
    options.layout_features = config['layoutFeatures']
    options.name_IDs = ['*']
    options.name_languages = ['*']
    options.hinting = True
    task = subset.Subsetter(options=options)
    task.populate(unicodes=keep)
    task.subset(font)
    instantiateVariableFont(font, {'wght': tuple(config['weightRange'])}, inplace=True, optimize=True)
    target_path.parent.mkdir(parents=True, exist_ok=True)
    font.flavor = 'woff2'
    font.save(target_path)
    optimized = TTFont(target_path, recalcTimestamp=False)
    report = verify(original, optimized, keep)
    target_bytes = target_path.read_bytes()
    face['sha256'] = sha256(target_bytes)
    reports.append({'file': face['file'], 'sourceBytes': len(source_bytes), 'bytes': len(target_bytes), 'sha256': face['sha256'], **report})
    print(json.dumps(reports[-1]), flush=True)

(directory / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
(directory / 'subset-report.json').write_text(json.dumps(reports, indent=2) + '\n', encoding='utf-8')
