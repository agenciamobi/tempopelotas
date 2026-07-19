export type NivelGuaibaCity = {
  name: string;
  slug: string;
  url: string;
  isPrimary?: boolean;
};

const NIVEL_GUAIBA_BASE_URL = "https://nivelguaiba.com.br";

export const NIVEL_GUAIBA_CITIES: NivelGuaibaCity[] = [
  {
    name: "Porto Alegre",
    slug: "portoalegre",
    url: `${NIVEL_GUAIBA_BASE_URL}/`,
    isPrimary: true,
  },
  {
    name: "São Leopoldo",
    slug: "saoleopoldo",
    url: `${NIVEL_GUAIBA_BASE_URL}/saoleopoldo`,
  },
  {
    name: "Lajeado",
    slug: "lajeado",
    url: `${NIVEL_GUAIBA_BASE_URL}/lajeado`,
  },
  {
    name: "Bom Retiro do Sul",
    slug: "bomretirodosul",
    url: `${NIVEL_GUAIBA_BASE_URL}/bomretirodosul`,
  },
  {
    name: "Cachoeira do Sul",
    slug: "cachoeiradosul",
    url: `${NIVEL_GUAIBA_BASE_URL}/cachoeiradosul`,
  },
  {
    name: "Dona Francisca",
    slug: "donafrancisca",
    url: `${NIVEL_GUAIBA_BASE_URL}/donafrancisca`,
  },
  {
    name: "Encantado",
    slug: "encantado",
    url: `${NIVEL_GUAIBA_BASE_URL}/encantado`,
  },
  {
    name: "Feliz",
    slug: "feliz",
    url: `${NIVEL_GUAIBA_BASE_URL}/feliz`,
  },
  {
    name: "Gravataí",
    slug: "gravatai",
    url: `${NIVEL_GUAIBA_BASE_URL}/gravatai`,
  },
  {
    name: "Muçum",
    slug: "mucum",
    url: `${NIVEL_GUAIBA_BASE_URL}/mucum`,
  },
  {
    name: "Rio Pardo",
    slug: "riopardo",
    url: `${NIVEL_GUAIBA_BASE_URL}/riopardo`,
  },
  {
    name: "São Sebastião do Caí",
    slug: "saosebastiaodocai",
    url: `${NIVEL_GUAIBA_BASE_URL}/saosebastiaodocai`,
  },
  {
    name: "Taquara",
    slug: "taquara",
    url: `${NIVEL_GUAIBA_BASE_URL}/taquara`,
  },
];

export { NIVEL_GUAIBA_BASE_URL };
