type SearchInputOptions = {
  codeCommune: string;
  codeEpci: string;
  searchCode: string;
  searchLibelle: string;
  ept: string;
  libellePetr: string;
  libellePnr: string;
  codePnr: string;
};

type SearchInputProps = {
  className?: string;
  setSearchCode: (a: string) => void;
  setSearchLibelle: (a: string) => void;
  searchCode: string;
  searchLibelle: string;
  id: string;
  placeholder: string;
  type: string;
  typeTerritoire: string | undefined;
  RechercherRedirection: () => void;
};

type SearchInputHeaderProps = {
  className?: string;
  setSearchCode: (a: string) => void;
  setSearchLibelle: (a: string) => void;
  searchCode: string;
  searchLibelle: string;
  id: string;
  placeholder: string;
  type: string;
  typeTerritoire: 'epci' | 'commune' | 'petr' | 'pnr' | 'departement';
  setIsTypeChanging: (a: boolean) => void;
  setIsTerritoryChanging: (a: boolean) => void;
  isTerritoryChanging: boolean;
  setIsNewTypeChosen: (a: boolean) => void;
  focusAutocomplete: boolean;
};

type SearchInputOptionsProps = {
  props: HTMLAttributes<HTMLLIElement>;
  option: SearchInputOptions;
};

type TerritoireType = 'epci' | 'commune' | 'petr' | 'pnr' | 'departement';

type SearchInputOptionsSansFiltre = SearchInputOptions & {
  territoireType: TerritoireType;
};

type SearchInputTagProps = {
  params: AutocompleteRenderInputParams;
  className?: string;
  typeTerritoire: string | undefined;
  setInputValue: (value: string) => void;
  setSearchCode: (value: string) => void;
  setSearchLibelle: (value: string) => void;
};

type SearchInputTagHeaderProps = {
  params: AutocompleteRenderInputParams;
  className?: string;
  typeTerritoire: string | undefined;
  setInputValue: (value: string) => void;
  setSearchCode: (value: string) => void;
  setSearchLibelle: (value: string) => void;
};
