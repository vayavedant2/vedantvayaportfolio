export type GlobeNode = {
  id: string;
  label: string;
  location: [number, number];
  hub?: boolean;
};

/** Client geographies connected through Jaipur. */
export const globeNodes: GlobeNode[] = [
  {
    id: "jaipur",
    label: "Jaipur",
    location: [26.9124, 75.7873],
    hub: true,
  },
  {
    id: "paris",
    label: "Paris",
    location: [48.8566, 2.3522],
  },
  {
    id: "new-york",
    label: "New York",
    location: [40.7128, -74.006],
  },
  {
    id: "san-francisco",
    label: "San Francisco",
    location: [37.7749, -122.4194],
  },
  {
    id: "mumbai",
    label: "Mumbai",
    location: [19.076, 72.8777],
  },
  {
    id: "delhi",
    label: "Delhi",
    location: [28.6139, 77.209],
  },
];
