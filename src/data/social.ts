export const social = {
  email: '',
  github: '',
  linkedin: '',
  scholar: '',
  orcid: '',
  cv: '',
  rss: import.meta.env.SITE_URL ? `${import.meta.env.BASE_URL}rss.xml` : '',
} as const;
