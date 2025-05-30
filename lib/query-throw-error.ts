export async function queryWithCustomError<Query extends () => Promise<any>>(
  errorMessage: string,
  query: Query
): Promise<ReturnType<Query>> {
  try {
    return await query();
  } catch (err) {
    console.log(err);
    const error = new Error(errorMessage);
    throw error;
  }
}
