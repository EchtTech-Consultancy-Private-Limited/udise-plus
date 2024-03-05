export const filterItemsStatePerPage = 10;
export const filterItemsYearPerPage = 4;

export const urls = ['/all-reports', '/school-reports', '/teacher-reports', '/infrastructure-reports3013'];

export const nationalWiseName = "All India/National";
export const stateWiseName = "State Wise";
export const districtWiseName = "District Wise"
export const blockWiseName = "Block Wise"
export const district = "District";
export const block = "Block"
export const nWiseregionType = 10;
export const nWiseregionCode = "99"
export const selectedDYear = "2019-20"
export const allSWiseregionType = 21
export const allSWiseregionCode = "11"
export const specificSWiseregionType = 11;
export const allDWiseregionType = 22;
export const specificDWiseregionType = 12;
export const allBWiseregionType = 23;
export const specificBWiseregionType = 13
export const convertToIndianNumberSystem = (number) => {
  if (number === undefined) {
    return '';
  } else if (number >= 10000000) {
    return (number / 10000000).toFixed(2) + ' Crore';
  } else if (number >= 100000) {
    return (number / 100000).toFixed(2) + ' Lakh';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(2) + ' Thousand';
  }
  else if (number >= 100) {
    return (number / 100).toFixed(2) + ' Hundred';
  }
  else {
    return number.toString();
  }
};