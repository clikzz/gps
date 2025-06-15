export function calculateAge(birthDate: Date | string): number {
  const birthDateObj =
    birthDate instanceof Date ? birthDate : new Date(birthDate);

  if (isNaN(birthDateObj.getTime())) {
    throw new Error("Invalid birth date provided");
  }

  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }

  return age;
}