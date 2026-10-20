/** sessionStorage key handing the submitted lead summary to /thank-you. */
export const LEAD_SUMMARY_KEY = "hh_lead_summary";

export type LeadSummary = {
  name: string;
  projectType: string;
  plotSize: string;
  location: string;
  budget: string;
};
