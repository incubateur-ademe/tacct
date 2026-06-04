import { Button } from "@mui/material";

export const HomeButton = ({
  borderColor,
  backgroundColor,
  textColor,
  link,
  text,
  target,
  rel
}: {
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  link: string;
  text: string;
  target?: string;
  rel?: string;
}) => {
  return (
    <Button
      key="0"
      variant="outlined"
      href={link}
      target={target}
      rel={rel}
      sx={{
        textTransform: 'none',
        color: textColor,
        backgroundColor: backgroundColor,
        borderRadius: '60px',
        border: `1px solid ${borderColor}`,
        padding: '0.5em 1em',
        fontWeight: 500,
        fontFamily: 'inherit',
        fontSize: '18px',
        margin: '2rem 0 0',
        backgroundImage: 'none',
        width: 'fit-content',
        '&:hover': {
          color: `${backgroundColor} !important`,
          backgroundColor: `${textColor} !important`,
        }
      }}
    >
      {text}
    </Button>
  );
}
