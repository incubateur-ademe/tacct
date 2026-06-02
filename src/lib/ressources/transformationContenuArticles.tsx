import { Block, BlockType } from '@/app/(main)/types';
import ZoomOnClick from '@/components/utils/ZoomOnClick';
import { Body, H2, H3 } from '@/design-system/base/Textes';
import { getBlocks } from '../queries/notion/notion';
import { normalizeText } from '../utils/reusableFunctions/NormalizeTexts';
import { groupAndRenderBlocks } from './bulletListContent';
import { downloadNotionImage } from './downloadNotionImage';
import { Text } from './Text';

export const renderBlock = async (el: Block, i: number) => {
  const value = el[el.type] as BlockType;
  const richText = value?.rich_text || [];

  switch (el.type) {
    case 'heading_1':
      return null;
    case 'paragraph':
      if (richText.length === 0) {
        return <div key={i} style={{ height: '1rem' }} />;
      }
      return (
        <div key={i} style={{ marginBottom: '1rem' }}>
          <Body>
            <Text text={richText} />
          </Body>
        </div>
      );
    case 'heading_2':
      const heading2Text = normalizeText(
        richText.map((rt) => rt.plain_text || rt.text.content).join('')
      );
      return (
        <div
          key={i}
          id={heading2Text}
          style={{
            marginBottom: '56px',
            marginTop: '80px',
            scrollMarginTop: '2rem'
          }}
        >
          <H2 style={{ margin: 0 }}>{heading2Text}</H2>
        </div>
      );
    case 'heading_3':
      const heading3Text = normalizeText(
        richText.map((rt) => rt.plain_text || rt.text.content).join('')
      );
      return (
        <div
          key={i}
          style={{
            margin: '56px 0 2rem 0'
          }}
        >
          <H3 style={{ margin: 0 }}>{heading3Text}</H3>
        </div>
      );
    case 'bulleted_list_item':
      const bulletChildren = el.has_children
        ? ((await getBlocks(el.id)) as Block[])
        : [];
      const bulletChildrenContent =
        bulletChildren.length > 0
          ? await groupAndRenderBlocks(bulletChildren)
          : null;
      return (
        <li key={i} style={{ margin: '1rem 0 1rem 1rem' }}>
          <Text text={richText} />
          {bulletChildrenContent}
        </li>
      );
    case 'numbered_list_item':
      const numberedChildren = el.has_children
        ? ((await getBlocks(el.id)) as Block[])
        : [];
      const numberedChildrenContent =
        numberedChildren.length > 0
          ? await groupAndRenderBlocks(numberedChildren)
          : null;
      return (
        <li key={i} style={{ margin: '1rem 0 1rem 1rem' }}>
          <Text text={richText} />
          {numberedChildrenContent}
        </li>
      );
    case 'image':
      const src =
        value?.type === 'external' ? value?.external?.url : value?.file?.url;
      const captionSegments = value?.caption || [];
      const captionPlainText = captionSegments
        .map((c) => c.plain_text || '')
        .join('');
      if (!src) return null;

      const localImagePath = await downloadNotionImage(src, el.id);

      return (
        <figure
          key={i}
          className="flex flex-col m-0 w-full"
          role="figure"
          aria-label={captionPlainText || undefined}
        >
          <ZoomOnClick
            src={localImagePath}
            alt={captionPlainText || ''}
            sizes="100%"
            width={0}
            height={0}
            style={{ width: '100%' }}
          />
          {captionSegments.length > 0 && (
            <figcaption className="text-sm text-gray-600 mt-2 text-center">
              <Text text={captionSegments} />
            </figcaption>
          )}
        </figure>
      );
    case 'callout':
      const calloutChildren = el.has_children
        ? ((await getBlocks(el.id)) as Block[])
        : [];
      const childrenContent = await groupAndRenderBlocks(calloutChildren);
      const colorClass = value?.color?.includes('gray')
        ? 'bg-gray-100 border-gray-300'
        : 'bg-blue-50 border-blue-300';
      const icon = value?.icon?.type === 'emoji' ? value.icon.emoji : null;
      return (
        <div key={i} className={`my-8 p-8 border-l-4 rounded ${colorClass}`}>
          <div className="font-semibold mb-6 flex flex-row items-start gap-2 text-[20px]">
            {icon && <span className="text-xl">{icon}</span>}
            <span>
              <Text text={richText} />
            </span>
          </div>
          <div>{childrenContent}</div>
        </div>
      );
    case 'column_list':
      const columns = el.has_children
        ? ((await getBlocks(el.id)) as Block[])
        : [];
      const columnsContent = await Promise.all(
        columns.map(async (column) => {
          if (column.type === 'column' && column.has_children) {
            const columnBlocks = (await getBlocks(column.id)) as Block[];
            const columnContent = await Promise.all(
              columnBlocks.map((block, idx) => renderBlock(block, idx))
            );
            return columnContent;
          }
          return null;
        })
      );
      return (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
            gap: '2rem',
            margin: '2rem 0'
          }}
        >
          {columnsContent.map((colContent, idx) => (
            <div key={idx}>{colContent}</div>
          ))}
        </div>
      );
    case 'column':
      return null;
    case 'quote':
      return (
        <div
          key={i}
          style={{
            borderLeft: '4px solid black',
            paddingLeft: '1.5rem',
            margin: '2rem 0',
            fontStyle: 'italic'
          }}
        >
          <Text text={richText} />
        </div>
      );
    case 'table':
      const tableRows = el.has_children
        ? ((await getBlocks(el.id)) as Block[])
        : [];
      return (
        <div key={i} style={{ margin: '2rem 0', overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #ddd'
            }}
          >
            <tbody>
              {tableRows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  style={rowIdx === 0 ? { backgroundColor: '#f6f6f6' } : {}}
                >
                  {row.table_row?.cells?.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      style={{
                        border: '1px solid #ddd',
                        padding: '0.75rem',
                        fontSize: '14px',
                        fontWeight: rowIdx === 0 ? 'bold' : 'normal'
                      }}
                    >
                      <Text text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'table_row':
      return null;
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Type de bloc non pris en compte: ${el.type}`, el);
      }
      return (
        <div
          key={i}
          style={{
            padding: '1rem',
            margin: '1rem 0',
            backgroundColor:
              process.env.NODE_ENV === 'development'
                ? '#fff3cd'
                : 'transparent',
            border:
              process.env.NODE_ENV === 'development'
                ? '1px solid #ffc107'
                : 'none'
          }}
        >
          {process.env.NODE_ENV === 'development' && (
            <div
              style={{
                color: '#856404',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}
            >
              ⚠️ Bloc non pris en compte : {el.type}
            </div>
          )}
          <Text text={richText} />
        </div>
      );
  }
};
