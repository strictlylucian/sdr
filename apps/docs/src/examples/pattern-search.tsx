import { docsUrl } from '../docs-url';
import { useState } from 'react';
import * as R from '../../../../packages/react/src';
import { tr, uiText, type P } from './support';

export function SearchFilterExample({ locale }: P) {
  const [filter, setFilter] = useState({ query: '', category: '' });
  const items = [
    { id: 'residence', label: tr(locale, "pattern-search.proofOfResidence"), category: 'documents' },
    { id: 'copy', label: tr(locale, "pattern-search.documentCopy"), category: 'documents' },
    { id: 'tax', label: tr(locale, "pattern-search.payAFee"), category: 'payments' },
  ];
  const visible = items.filter(item => (!filter.category || item.category === filter.category) && item.label.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().includes(filter.query.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()));
  return <form data-sdr-pattern-demo="search" className="sdr-stack" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setFilter({ query: String(data.get('query')), category: String(data.get('category')) }); }} onReset={() => setFilter({ query: '', category: '' })}>
    <R.TextInput label={tr(locale, "pattern-search.findAService")} type="search" name="query" autoComplete="off" />
    <R.Select label={tr(locale, "pattern-search.category")} name="category"><option value="">{tr(locale, "pattern-search.allCategories")}</option><option value="documents">{tr(locale, "pattern-search.documents")}</option><option value="payments">{tr(locale, "pattern-search.payments")}</option></R.Select>
    <R.Cluster><R.Button type="submit">{tr(locale, "pattern-search.search")}</R.Button><R.Button variant="secondary" type="reset">{tr(locale, "pattern-search.clearFilters")}</R.Button></R.Cluster>
    <p role="status" data-sdr-search-count>{uiText(locale, 'demo.results', { count: visible.length })}</p>
    <p data-sdr-search-empty hidden={visible.length !== 0}>{tr(locale, "pattern-search.noResultsFoundTryAnotherSearchOrClearThe")}</p>
    <R.Grid columns={2} data-sdr-search-results hidden={visible.length === 0}>{items.map(item => <div key={item.id} data-sdr-search-item data-category={item.category} data-search-label={item.label} hidden={!visible.includes(item)}><R.Card title={item.label} footer={<R.Link href={docsUrl(`/${locale}/patterns/start/`)}>{tr(locale, "pattern-search.viewSteps")}</R.Link>}>{tr(locale, "pattern-search.exampleService")}</R.Card></div>)}</R.Grid>
  </form>;
}
