import { cx } from "@codegouvfr/react-dsfr/tools/cx";

export const RenderInputHeader = (props: SearchInputTagHeaderProps) => {
  const {
    params,
    className,
    setInputValue,
    setSearchCode,
    setSearchLibelle,
  } = props;
  return (
    <div ref={params.InputProps.ref} style={{ minWidth: 0 }}>
      <input
        {...params.inputProps}
        className={cx(params.inputProps.className, className)}
        placeholder={'Saisissez votre territoire'}
        style={{
          borderRadius: '30px',
          padding: '0 2rem 0 0.75rem',
          fontSize: '14px',
          lineHeight: '19px',
          fontFamily: 'Marianne',
          fontWeight: 400,
          color: '#000000',
          maxHeight: "none",
          cursor: "pointer",
          minWidth: 0
        }}
      />
      {params.InputProps.endAdornment && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setInputValue('');
            setSearchCode('');
            setSearchLibelle('');
          }}
        >
          {params.InputProps.endAdornment}
        </div>
      )}
    </div>
  );
}
