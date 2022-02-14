import React, { Fragment } from "react";
import styled from "styled-components";
import { Text } from "@blueprintjs/core";

import Form from "./Form";
import WidgetStyleContainer, {
  BoxShadow,
} from "components/designSystems/appsmith/WidgetStyleContainer";
import { Color } from "constants/Colors";
import { ExecuteTriggerPayload } from "constants/AppsmithActionConstants/ActionConstants";
import { FIELD_MAP, ROOT_SCHEMA_KEY, Schema } from "../constants";
import { FormContextProvider } from "../FormContext";
import { isEmpty, pick } from "lodash";
import { RenderMode, RenderModes, TEXT_SIZES } from "constants/WidgetConstants";
import { JSONFormWidgetState, MAX_ALLOWED_FIELDS } from "../widget";
import { ButtonStyleProps } from "widgets/ButtonWidget/component";

type StyledContainerProps = {
  backgroundColor?: string;
};

export type JSONFormComponentProps<TValues = any> = {
  backgroundColor?: string;
  borderColor?: Color;
  borderRadius?: number;
  borderWidth?: number;
  boxShadow?: BoxShadow;
  boxShadowColor?: string;
  disabledWhenInvalid?: boolean;
  executeAction: (actionPayload: ExecuteTriggerPayload) => void;
  fieldLimitExceeded: boolean;
  fixedFooter: boolean;
  isSubmitting: boolean;
  onSubmit: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  renderMode: RenderMode;
  resetButtonStyles: ButtonStyleProps;
  schema: Schema;
  scrollContents: boolean;
  setMetaInternalFieldState: (
    cb: (prevState: JSONFormWidgetState) => JSONFormWidgetState,
  ) => void;
  showReset: boolean;
  submitButtonStyles: ButtonStyleProps;
  title: string;
  updateFormData: (values: TValues) => void;
  updateWidgetMetaProperty: (propertyName: string, propertyValue: any) => void;
  updateWidgetProperty: (propertyName: string, propertyValue: any) => void;
  widgetId: string;
};

const StyledContainer = styled(WidgetStyleContainer)<StyledContainerProps>`
  background: ${({ backgroundColor }) => backgroundColor || "#fff"};
  overflow-y: auto;
`;

const MessageStateWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
`;

const Message = styled(Text)`
  font-size: ${TEXT_SIZES.HEADING3};
  left: 50%;
  position: absolute;
  text-align: center;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
`;

function InfoMessage({ children }: { children: React.ReactNode }) {
  return (
    <MessageStateWrapper>
      <Message>{children}</Message>
    </MessageStateWrapper>
  );
}

function JSONFormComponent<TValues>({
  executeAction,
  fieldLimitExceeded,
  isSubmitting,
  renderMode,
  schema,
  setMetaInternalFieldState,
  updateWidgetMetaProperty,
  updateWidgetProperty,
  ...rest
}: JSONFormComponentProps<TValues>) {
  const isSchemaEmpty = isEmpty(schema);
  const styleProps = pick(rest, [
    "backgroundColor",
    "borderColor",
    "borderWidth",
    "borderRadius",
    "boxShadow",
    "boxShadowColor",
    "widgetId",
  ]);

  const renderRootField = () => {
    const rootSchemaItem = schema[ROOT_SCHEMA_KEY];
    const RootField = FIELD_MAP[rootSchemaItem.fieldType] || Fragment;
    const propertyPath = `schema.${ROOT_SCHEMA_KEY}`;

    return (
      <RootField
        fieldClassName="root"
        isRootField
        name=""
        propertyPath={propertyPath}
        schemaItem={rootSchemaItem}
      />
    );
  };

  const renderComponent = (() => {
    if (fieldLimitExceeded) {
      return (
        <InfoMessage>
          Source data exceeds {MAX_ALLOWED_FIELDS} fields.&nbsp;
          {renderMode === RenderModes.PAGE
            ? "Please contact your developer for more information"
            : "Please update the source data."}
        </InfoMessage>
      );
    }
    if (isEmpty(schema)) {
      return (
        <InfoMessage>
          Connect data or paste JSON to add items to this form.
        </InfoMessage>
      );
    }

    return renderRootField();
  })();

  return (
    <FormContextProvider
      executeAction={executeAction}
      renderMode={renderMode}
      setMetaInternalFieldState={setMetaInternalFieldState}
      updateWidgetMetaProperty={updateWidgetMetaProperty}
      updateWidgetProperty={updateWidgetProperty}
    >
      <StyledContainer {...styleProps}>
        <Form
          disabledWhenInvalid={rest.disabledWhenInvalid}
          fixedFooter={rest.fixedFooter}
          isSubmitting={isSubmitting}
          onSubmit={rest.onSubmit}
          resetButtonStyles={rest.resetButtonStyles}
          schema={schema}
          scrollContents={rest.scrollContents}
          showReset={rest.showReset}
          stretchBodyVertically={isSchemaEmpty}
          submitButtonStyles={rest.submitButtonStyles}
          title={rest.title}
          updateFormData={rest.updateFormData}
        >
          {renderComponent}
        </Form>
      </StyledContainer>
    </FormContextProvider>
  );
}

export default React.memo(JSONFormComponent);