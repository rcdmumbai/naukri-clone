export function formatSalary(min: number, max: number) {
  if (!min && !max) return "Not disclosed";
  return `${min}-${max} Lacs PA`;
}

export function formatExperience(min: number, max: number) {
  if (min === max) return `${min} Yrs`;
  return `${min}-${max} Yrs`;
}

export function formatPostedAt(date: Date | string) {
  const posted = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - posted.getTime();
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days <= 0) {
    const hours = Math.max(1, Math.floor(diffMs / (60 * 60 * 1000)));
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

export function splitList(value: string | null | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function humanize(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatCount(count: number) {
  if (count >= 100000) return `${(count / 100000).toFixed(1).replace(/\.0$/, "")} Lakh+`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K+`;
  return String(count);
}
