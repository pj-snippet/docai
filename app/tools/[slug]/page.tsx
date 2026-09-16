import DynamicToolClient from './DynamicToolClient';

const SEO_PAGES: Record<string, { title: string; description: string; defaultPrompt: string }> = {
  'extract-invoice-data': {
    title: 'Free AI Invoice Data Extractor',
    description: 'Instantly extract line items, vendor details, and totals from PDF invoices.',
    defaultPrompt: 'Extract all line items, total amount, invoice number, and vendor name into a clean format.',
  },
  'summarize-legal-contract': {
    title: 'AI Legal Contract Summarizer',
    description: 'Summarize key clauses, obligations, and risk factors in legal PDF documents.',
    defaultPrompt: 'Summarize key terms, expiration dates, liabilities, and core obligations.',
  },
  'pdf-table-extractor': {
    title: 'Extract Tables from PDF Online',
    description: 'Convert embedded PDF tables into clean structured text or JSON instantly.',
    defaultPrompt: 'Extract all table data accurately into structured markdown tables.',
  },
};

export default function Page({ params }: { params: { slug: string } }) {
  const page = SEO_PAGES[params.slug];

  if (!page) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-500 font-medium">
        Tool page not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{page.title}</h1>
      <p className="text-gray-600 mb-6">{page.description}</p>
      <DynamicToolClient defaultPrompt={page.defaultPrompt} />
    </div>
  );
}