import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Panel({
  title,
  iconElement,
  badge,
  actions,
  children,
  fullWidth,
  footer,
}) {
  return (
    <div className={`border rounded ${fullWidth ? "col-span-full" : ""}`}>
      <div className="flex justify-between p-3 border-b">
        <div className="flex gap-2 items-center">
          {iconElement}
          {title}
          {badge !== undefined && <span>{badge}</span>}
        </div>
        {actions}
      </div>

      <div>{children}</div>

      {footer && (
        <div className="flex justify-between p-2">
          <span>{footer.current} of {footer.total}</span>
          <div>
            <button onClick={() => footer.onPageChange(footer.page - 1)}>
              <ChevronLeft />
            </button>
            <button onClick={() => footer.onPageChange(footer.page + 1)}>
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}