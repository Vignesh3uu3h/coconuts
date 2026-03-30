export const sendMockMessage = async ({ agent, farmer, message }) => {
  const timestamp = new Date().toISOString()
  console.log(`[MOCK MESSAGE] ${timestamp} | Agent: ${agent?.name || 'unknown'} | Farmer: ${farmer?.name || 'unknown'} | Message: ${message}`)
  return true
}
