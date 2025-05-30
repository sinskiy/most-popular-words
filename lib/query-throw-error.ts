export async function queryWithCustomError<
  Query extends () => Promise<any>,
  Return
>(errorMessage: string, query: Query): Promise<Return> {
  try {
    return await query();
  } catch (err) {
    console.log(err);
    const error = new Error(errorMessage);
    throw error;
  }
}
