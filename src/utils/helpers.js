export function getStatusColor(status) {
  if (!status) return { bg: "bg-gray-100", text: "text-gray-500" };

  const s = status.toLowerCase();

  if (["completed", "done", "published", "approved", "sent", "active"].includes(s)) {
    return { bg: "bg-green-100", text: "text-green-700" };
  }

  if (["in progress", "in review"].includes(s)) {
    return { bg: "bg-blue-100", text: "text-blue-700" };
  }

  if (["pending", "pre-req check", "draft", "scheduled"].includes(s)) {
    return { bg: "bg-yellow-100", text: "text-yellow-700" };
  }

  if (["at risk", "warn", "overdue"].includes(s)) {
    return { bg: "bg-red-100", text: "text-red-700" };
  }

  return { bg: "bg-gray-100", text: "text-gray-500" };
}

export function getStepDotColor(state) {
  switch (state) {
    case "done":
      return "bg-green-500";
    case "active":
      return "bg-blue-500";
    case "warn":
      return "bg-yellow-500";
    default:
      return "bg-gray-400";
  }
}

export function getIconColorClasses(icon) {
  switch (icon) {
    case "blue":
      return { bg: "bg-blue-100", text: "text-blue-600" };
    case "green":
      return { bg: "bg-green-100", text: "text-green-600" };
    case "amber":
      return { bg: "bg-yellow-100", text: "text-yellow-600" };
    case "purple":
      return { bg: "bg-purple-100", text: "text-purple-600" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-500" };
  }
}

export function filterRows(rows, query) {
  if (!query.trim()) return rows;

  const q = query.toLowerCase();

  return rows.filter((row) =>
    Object.values(row).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(q)
    )
  );
}

export function paginate(items, page, perPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const start = (page - 1) * perPage;

  return {
    data: items.slice(start, start + perPage),
    totalPages,
  };
}