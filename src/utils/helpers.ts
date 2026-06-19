export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

export const getInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return '';

  const spaceIndex = trimmed.indexOf(' ');
  if (spaceIndex === -1) {
    return trimmed.charAt(0).toUpperCase();
  }

  const firstInitial = trimmed.charAt(0);
  const secondInitial = trimmed.slice(spaceIndex + 1).trim().charAt(0);
  return `${firstInitial}${secondInitial}`.toUpperCase();
};

export const validateEmailOrMobile = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[+]?[\d\s-]{7,15}$/;
  return emailRegex.test(value) || mobileRegex.test(value.trim());
};
