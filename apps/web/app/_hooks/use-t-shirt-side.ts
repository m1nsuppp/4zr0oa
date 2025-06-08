import { useQueryState, parseAsStringLiteral } from 'nuqs';
import { type TShirtSide, tShirtSideEnum } from '../../models/t-shirt.model';

export function useTShirtSide(): [TShirtSide, (side: TShirtSide) => void] {
  const [tShirtSide, setTShirtSide] = useQueryState(
    'side',
    parseAsStringLiteral(tShirtSideEnum.options).withDefault('front'),
  );

  return [tShirtSide, setTShirtSide] as const;
}
