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