'use client';

import { type ButtonProps } from '@codegouvfr/react-dsfr/Button';
import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';

import { config } from '@/config';
import { Any } from './lib/utils/types';

const DEFAULT_CTA_HREF = config.formUrl;
const DEFAULT_CTA_TITLE = '';

export interface CTAProps {
  buttons: Any[];
  mobile?: boolean;
}
export const CTA = ({ buttons, mobile: asGroup }: CTAProps) => {
  return (
    <ButtonsGroup
      alignment={asGroup ? 'center' : 'left'}
      buttonsSize={asGroup ? 'large' : 'medium'}
      inlineLayoutWhen="always"
      buttonsEquisized={asGroup}
      buttons={
        buttons.map(
          ({ source, priority, title = DEFAULT_CTA_TITLE, anchor, href }) =>
            (({
              children: title,
              title,

              linkProps: {
                href: href ?? (anchor ? `#${anchor}` : DEFAULT_CTA_HREF)
              },

              priority
            }) as ButtonProps)
        ) as [ButtonProps, ...ButtonProps[]]
      }
    />
  );
  // return asGroup ? (
  //   <ButtonsGroup
  //     alignment="center"
  //     buttonsSize="large"
  //     inlineLayoutWhen="always"
  //     buttons={[
  //       {
  //         title,
  //         children,
  //         linkProps: {
  //           onClick,
  //           href: href as never,
  //         },
  //       },
  //     ]}
  //   />
  // ) : (
  //   <Button
  //     title={title}
  //     linkProps={{
  //       onClick,
  //       href: href as never,
  //     }}
  //   >
  //     {children}
  //   </Button>
  // );
};
