// https://github.com/bvaughn/react-window/issues/6
// https://gist.github.com/tsirlucas/637c948e1e55a3c2439df9b87ec6a13b

import { useState, useEffect, useCallback } from 'react';

const useReverseScroll = ({ ref, data }) => {
  const [indexesCoordinates, setIndexesCoordinates] = useState({});
  const [lastData, setLastData] = useState([]);
  const [totalScrollSize, setTotalScrollSize] = useState(0);
  const [divHeight, setDivHeight] = useState(0);

  const updateScrollValues = useCallback(
    (currentRef) => {
      // Keep track of div size and scroll size so we can decide how much we
      // want to scroll and if we want to
      if (currentRef) {
        if (currentRef._instanceProps.totalMeasuredSize !== totalScrollSize) {
          setTotalScrollSize(currentRef._instanceProps.totalMeasuredSize);
        }
        if (currentRef.props.height !== divHeight) {
          setDivHeight(currentRef.props.height);
        }
      }
    },
    [totalScrollSize, divHeight]
  );

  useEffect(() => {
    // Should only scroll on data change if was scrolled to bottom
    // before the size change. So we use the last data <= 1
    // because we are subtracting the size for the last index
    const wasScrolledToBottom =
      lastData.length - indexesCoordinates.visibleStopIndex <= 1;
    const hasScroll = totalScrollSize > divHeight;
    const didItemsChange = lastData.length !== data.length;
    if (didItemsChange && hasScroll) {
      const firstItemLastData = lastData[0] || {};
      const firstItemData = data[0] || {};
      // If it was scrolled to botom, we should keep the scroll there by scrolling
      // to the bottom when new messages arrive
      if (wasScrolledToBottom) {
        ref.scrollTo(totalScrollSize);
        if (
          Object.keys(ref._instanceProps.itemOffsetMap).length === data.length
        ) {
          // This ensures the scroll will be at the bottom when you open a scroll which you already have all data loaded
          setLastData(data);
          ref.scrollTo(
            totalScrollSize + ref._instanceProps.itemSizeMap[data.length - 1]
          );
        }
      } else if (
        !wasScrolledToBottom &&
        firstItemLastData.id !== firstItemData.id
      ) {
        // If user loaded new items by scrolling up, we should scroll to the difference
        const offsetArray = Object.values(ref._instanceProps.itemOffsetMap);
        const difference = data.length - lastData.length;
        const differenceItem = offsetArray[difference - 1];
        if (differenceItem) {
          setLastData(data);
          ref.scrollTo(differenceItem);
        }
      }
    }
  }, [data.length, indexesCoordinates, totalScrollSize, divHeight]);

  useEffect(() => {
    updateScrollValues(ref);
  }, [
    ref && ref.props.height,
    ref && ref._instanceProps.totalMeasuredSize,
    ref && ref._instanceProps.itemOffsetMap,
  ]);

  const onItemsRendered = useCallback(
    (params) => {
      setIndexesCoordinates(params);

      updateScrollValues(ref);
    },
    [ref]
  );

  return { onItemsRendered };
};

export default useReverseScroll;
