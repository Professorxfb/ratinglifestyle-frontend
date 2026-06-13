import Breadcrumb, { type Crumb } from "./Breadcrumb";

export default function PageHeader({
  title,
  description,
  crumbs,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
}) {
  return (
    <div className="border-b border-line bg-charcoal">
      <div className="container-luxe py-12">
        {crumbs && <Breadcrumb items={crumbs} />}
        <h1 className="heading-display mt-4">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
        )}
      </div>
    </div>
  );
}
