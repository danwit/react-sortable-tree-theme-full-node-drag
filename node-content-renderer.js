import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './node-content-renderer.scss';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

function isDescendant(older, younger) {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(
      child => child === younger || isDescendant(child, younger)
    )
  );
}

// eslint-disable-next-line react/prefer-stateless-function
class CustomThemeNodeContentRenderer extends Component {
  render() {
    const {
      scaffoldBlockPxWidth,
      toggleChildrenVisibility,
      connectDragPreview,
      connectDragSource,
      isDragging,
      canDrop,
      canDrag,
      node,
      title,
      subtitle,
      draggedNode,
      path,
      treeIndex,
      isSearchMatch,
      isSearchFocus,
      icons,
      buttons,
      className,
      style,
      didDrop,
      lowerSiblingCounts,
      listIndex,
      swapFrom,
      swapLength,
      swapDepth,
      treeId, // Not needed, but preserved for other renderers
      isOver, // Not needed, but preserved for other renderers
      parentNode, // Needed for dndManager
      rowDirection,
      ...otherProps
    } = this.props;
    const nodeTitle = title || node.title;
    const nodeSubtitle = subtitle || node.subtitle;

    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
    const isLandingPadActive = !didDrop && isDragging;

    const nodeContent = connectDragPreview(
      <div
        className={
          styles.row +
          (isLandingPadActive ? ` ${styles.rowLandingPad}` : '') +
          (isLandingPadActive && !canDrop ? ` ${styles.rowCancelPad}` : '') +
          (isSearchMatch ? ` ${styles.rowSearchMatch}` : '') +
          (isSearchFocus ? ` ${styles.rowSearchFocus}` : '') +
          (className ? ` ${className}` : '')
        }
        style={{
          opacity: isDraggedDescendant ? 0.5 : 1,
          ...style,
        }}
      >
        <DragIndicatorIcon fontSize='small' color='disabled'/>
        <div
          className={
            styles.rowContents +
            (!canDrag ? ` ${styles.rowContentsDragDisabled}` : '')
          }
        >

          <div className={styles.rowLabel}>
            <span
              className={
                styles.rowTitle +
                (node.subtitle ? ` ${styles.rowTitleWithSubtitle}` : '')
              }
            >
              {typeof nodeTitle === 'function'
                ? nodeTitle({
                    node,
                    path,
                    treeIndex,
                  })
                : nodeTitle}
            </span>

            {nodeSubtitle && (
              <span className={styles.rowSubtitle}>
                {typeof nodeSubtitle === 'function'
                  ? nodeSubtitle({
                      node,
                      path,
                      treeIndex,
                    })
                  : nodeSubtitle}
              </span>
            )}
          </div>

          <div className={styles.rowToolbar}>
            {buttons.map((btn, index) => (
              <div
                key={index} // eslint-disable-line react/no-array-index-key
                className={styles.toolbarButton}
              >
                {btn}
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    return (
      <div style={{ height: '100%' }} {...otherProps}>
        {toggleChildrenVisibility &&
          node.children &&
          (node.children.length > 0 || typeof node.children === 'function') && (
            <div>
              <button
                type="button"
                aria-label={node.expanded ? 'Collapse' : 'Expand'}
                className={
                  node.expanded ? styles.collapseButton : styles.expandButton
                }
                style={{ left: -0.5 * scaffoldBlockPxWidth }}
                onClick={() =>
                  toggleChildrenVisibility({
                    node,
                    path,
                    treeIndex,
                  })
                }
              
              >
                {
                  (node.expanded) ? (
                    <ArrowDropDownIcon className={styles.btnIcon} color='disabled'/>
                  ) : (
                    <ArrowRightIcon className={styles.btnIcon} color='disabled'/>
                  )
                }
              </button>
            </div>
          )}

        <div
          className={
            styles.rowWrapper +
            (!canDrag ? ` ${styles.rowWrapperDragDisabled}` : '')
          }
        >
          {canDrag
            ? connectDragSource(nodeContent, { dropEffect: 'copy' })
            : nodeContent}
        </div>
      </div>
    );
  }
}

CustomThemeNodeContentRenderer.defaultProps = {
  buttons: [],
  canDrag: false,
  canDrop: false,
  className: '',
  draggedNode: null,
  icons: [],
  isSearchFocus: false,
  isSearchMatch: false,
  parentNode: null,
  style: {},
  subtitle: null,
  swapDepth: null,
  swapFrom: null,
  swapLength: null,
  title: null,
  toggleChildrenVisibility: null,
};

CustomThemeNodeContentRenderer.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  canDrag: PropTypes.bool,
  className: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.node),
  isSearchFocus: PropTypes.bool,
  isSearchMatch: PropTypes.bool,
  listIndex: PropTypes.number.isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  subtitle: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  swapDepth: PropTypes.number,
  rowDirection: PropTypes.string.isRequired,
  swapFrom: PropTypes.number,
  swapLength: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  toggleChildrenVisibility: PropTypes.func,
  treeIndex: PropTypes.number.isRequired,
  treeId: PropTypes.string.isRequired,

  // Drag and drop API functions
  // Drag source
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  didDrop: PropTypes.bool.isRequired,
  draggedNode: PropTypes.shape({}),
  isDragging: PropTypes.bool.isRequired,
  parentNode: PropTypes.shape({}), // Needed for dndManager
  // Drop target
  canDrop: PropTypes.bool,
  isOver: PropTypes.bool.isRequired,
};

export default CustomThemeNodeContentRenderer;
