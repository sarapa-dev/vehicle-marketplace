export const formatMileage = (km: number) => new Intl.NumberFormat("de-DE").format(km) + " km";

export const formatPrice = (price: number) => new Intl.NumberFormat("de-DE").format(price) + " €";

export const formatDisplacement = (cc: number) => {
  return (cc / 1000).toFixed(1) + "L";
};

export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
