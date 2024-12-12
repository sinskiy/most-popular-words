export interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface ErrorPageProps {
  error: Error;
}
