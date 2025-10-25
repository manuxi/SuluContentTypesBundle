// @flow
import React from 'react';
import {observer} from 'mobx-react';
import {SingleSelect, Icon} from 'sulu-admin-bundle/components';
import type {FieldTypeProps} from 'sulu-admin-bundle/types';
import {toJS} from 'mobx';

const styles = {
    colorSelectOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    colorSelectLabel: {
        flex: 1,
    },
};

@observer
class ColorSelect extends React.Component<FieldTypeProps<string>> {
    handleChange = (value: string | number) => {
        const {onChange, onFinish} = this.props;

        onChange(value);
        onFinish();
    };

    render() {
        const {dataPath, error, value, schemaOptions} = this.props;

        // Convert MobX observable to plain array
        const values: Array<any> = toJS(schemaOptions?.values?.value || []);

        const selectValues = values.map((item) => {
            // Parse value format "primary:#0d6efd"
            const itemValue = item.value || '';
            const parts = itemValue.split(':');
            const name = parts[0];
            const color = parts[1] || '#000000';

            // Get translatable title from metadata, fallback to capitalized name
            const displayName = item.title || name.charAt(0).toUpperCase() + name.slice(1);

            return {
                value: itemValue,
                label: (
                    <div style={styles.colorSelectOption}>
                        <Icon
                            name="su-square"
                            style={{color: color}}
                        />
                        <span style={styles.colorSelectLabel}>{displayName}</span>
                    </div>
                ),
            };
        });

        return (
            <SingleSelect
                id={dataPath}
                value={value}
                onChange={this.handleChange}
                valid={!error}
            >
                {selectValues.map((option) => (
                    <SingleSelect.Option key={option.value} value={option.value}>
                        {option.label}
                    </SingleSelect.Option>
                ))}
            </SingleSelect>
        );
    }
}

export default ColorSelect;