export const PERSONAL_DOMAINS = [
  { alias: "coopskicks.co", username: "coops.kicks" },
  { alias: "mikedeezy.com", username: "mike" },
  { alias: "mikedecena.com", username: "mike" },
  { alias: "roaming-ventures.com", username: "rv" },
  { alias: "findcurate.co", username: "Find Curate" },
  { alias: "soleant.co", username: "Find Curate" },
  { alias: "demonites.co", username: "demonites" },
  { alias: "demonitesbrand.com", username: "demonites" },
  { alias: "theloopjc.com", username: "theloopjc" },
  {
    alias: "theconnectclothingstores.com",
    username: "TheConnectClothingStore",
  },
  { alias: "stoccroomnj.com", username: "stoccroomllc" },
  { alias: "elitekickzhoboken.com", username: "EliteKickz" },
  { alias: "fearnosole.com", username: "fearnosole" },
  { alias: "shmurda.co", username: "shmurda" },
  { alias: "theshoegameco.com", username: "The Shoe Game Co." },
  { alias: "evasionkicks.com", username: "EvasionKicks" },
  { alias: "the-era.us", username: "The Era" },
  { alias: "kicknarimasu.com", username: "kick_narimasu" },
];

export function getPersonalShopFullUrl(username: string) {
  const personalDomainShop = PERSONAL_DOMAINS.find(
    (x) => x.username === username
  )?.alias;

  const result = personalDomainShop
    ? `https://${personalDomainShop}`
    : `https://shop.copt.io/${username}`;
  return result;
}
