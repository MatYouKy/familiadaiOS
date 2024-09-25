export const validateIpAddress = (ipAddress: string) => {
  // Wyrażenie regularne do walidacji adresu IP
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;

  return ipRegex.test(ipAddress);
};