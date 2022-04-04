import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { get } from "lodash";
import { isEllipsisActive } from "utils/helpers";
import TooltipComponent from "components/ads/Tooltip";
import { getTypographyByKey } from "constants/DefaultTheme";
import { Position } from "@blueprintjs/core";

import { useSelector } from "react-redux";

import { getSelectedAppTheme } from "selectors/appThemingSelectors";

const PageTab = styled.div`
  display: flex;
  max-width: 170px;
  align-self: flex-end;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;

const StyledBottomBorder = styled.div<{ primaryColor: string }>`
  position: relative;
  transition: all 0.3s ease-in-out;
  height: 2px;
  width: 100%;
  left: -100%;
  background-color: ${({ primaryColor }) => primaryColor};
  ${PageTab}:hover & {
    position: relative;
    width: 100%;
    left: 0;
  }
`;

const StyleTabText = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${(props) => getTypographyByKey(props, "h6")}
  color: ${(props) => props.theme.colors.header.tabText};
  height: ${(props) => `calc(${props.theme.smallHeaderHeight})`};
  & span {
    height: 100%;
    max-width: 138px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }
  ${PageTab}.is-active & {
    color: ${(props) => props.theme.colors.header.activeTabText};
    ${StyledBottomBorder} {
      left: 0;
    }
  }
`;

function PageTabName({
  name,
  primaryColor,
}: {
  name: string;
  primaryColor: string;
}) {
  const tabNameRef = useRef<HTMLSpanElement>(null);
  const [ellipsisActive, setEllipsisActive] = useState(false);
  const tabNameText = (
    <StyleTabText>
      <div className="relative flex items-center justify-center flex-grow">
        <span ref={tabNameRef}>{name}</span>
        {ellipsisActive && "..."}
      </div>
      <StyledBottomBorder primaryColor={primaryColor} />
    </StyleTabText>
  );

  useEffect(() => {
    if (isEllipsisActive(tabNameRef?.current)) {
      setEllipsisActive(true);
    }
  }, [tabNameRef]);

  return (
    <TooltipComponent
      boundary="viewport"
      content={name}
      disabled={!ellipsisActive}
      maxWidth="400px"
      position={Position.BOTTOM}
    >
      {tabNameText}
    </TooltipComponent>
  );
}

function PageTabContainer({
  children,
  isTabActive,
  setShowScrollArrows,
  tabsScrollable,
}: {
  children: React.ReactNode;
  isTabActive: boolean;
  tabsScrollable: boolean;
  setShowScrollArrows: () => void;
}) {
  const tabContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTabActive) {
      tabContainerRef.current?.scrollIntoView(false);
      setShowScrollArrows();
    }
  }, [isTabActive, tabsScrollable]);

  return <div ref={tabContainerRef}>{children}</div>;
}

type Props = {
  tabs: Array<{
    id: string;
    label: string;
    widgetId: string;
    isVisible?: boolean;
  }>;
  measuredTabsRef: (ref: HTMLElement | null) => void;
  tabsScrollable: boolean;
  setShowScrollArrows: () => void;
  tabChange: (tabId: string) => void;
  selectedTabWidgetId: string;
};

export function PageTabs(props: Props) {
  const { tabChange, tabs } = props;
  const selectedTheme = useSelector(getSelectedAppTheme);

  return (
    <div
      className="flex items-end w-full h-full overflow-hidden gap-x-8"
      ref={props.measuredTabsRef}
    >
      {tabs.map((tab, index) => (
        <PageTabContainer
          isTabActive={props.selectedTabWidgetId === tab.widgetId}
          key={index}
          setShowScrollArrows={props.setShowScrollArrows}
          tabsScrollable={props.tabsScrollable}
        >
          <PageTab
            className={`t--page-switch-tab ${
              props.selectedTabWidgetId === tab.widgetId ? "is-active" : ""
            }`}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              tabChange(tab.widgetId);
              event.stopPropagation();
            }}
          >
            <PageTabName
              name={tab.label}
              primaryColor={get(
                selectedTheme,
                "properties.colors.primaryColor",
                "inherit",
              )}
            />
          </PageTab>
        </PageTabContainer>
      ))}
    </div>
  );
}

export default PageTabs;
