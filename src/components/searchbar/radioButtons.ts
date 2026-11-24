export const allRadioOptions = (
  typeTerritoire: string,
  handleRadioChange: (
    value: 'epci' | 'commune' | 'petr' | 'pnr' | 'polem' | 'departement'
  ) => void
) => [
  {
    label: 'EPCI/EPT',
    nativeInputProps: {
      checked: typeTerritoire === 'epci',
      onChange: () => handleRadioChange('epci')
    }
  },
  {
    label: 'Commune',
    nativeInputProps: {
      checked: typeTerritoire === 'commune',
      onChange: () => handleRadioChange('commune')
    }
  },
  {
    label: 'PETR',
    nativeInputProps: {
      checked: typeTerritoire === 'petr',
      onChange: () => handleRadioChange('petr')
    }
  },
  {
    label: 'PNR',
    nativeInputProps: {
      checked: typeTerritoire === 'pnr',
      onChange: () => handleRadioChange('pnr')
    }
  },
  {
    label: 'POLEM',
    nativeInputProps: {
      checked: typeTerritoire === 'polem',
      onChange: () => handleRadioChange('polem')
    }
  },
  {
    label: 'Département',
    nativeInputProps: {
      checked: typeTerritoire === 'departement',
      onChange: () => handleRadioChange('departement')
    }
  }
];

export const patch4ActiveRadioOptions = (
  typeTerritoire: string,
  handleRadioChange: (value: 'epci' | 'commune') => void
) => [
  {
    label: 'EPCI/EPT',
    nativeInputProps: {
      checked: typeTerritoire === 'epci',
      onChange: () => handleRadioChange('epci')
    }
  },
  {
    label: 'Commune',
    nativeInputProps: {
      checked: typeTerritoire === 'commune',
      onChange: () => handleRadioChange('commune')
    }
  }
];

export const patch4DisabledRadioOptions = (typeTerritoire: string) => [
  {
    label: 'PETR',
    nativeInputProps: {
      checked: typeTerritoire === 'petr'
    }
  },
  {
    label: 'PNR',
    nativeInputProps: {
      checked: typeTerritoire === 'pnr'
    }
  },
  {
    label: 'Département',
    nativeInputProps: {
      checked: typeTerritoire === 'departement'
    }
  }
];
