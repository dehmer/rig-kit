
/**
 *
 */
export default fn => {
  try {
    fn()
  } catch(err) {
    console.error(err)
  }
}
