import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@constants/theme';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  error?: string;
}

export default function Dropdown({ label, value, onChange, options, placeholder = 'select...', error }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectorLayout, setSelectorLayout] = useState({ y: 0, height: 0 });
  const selectorRef = React.useRef<View>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const handleOpen = () => {
    selectorRef.current?.measureInWindow((x, y, width, height) => {
      setSelectorLayout({ y, height });
      setIsOpen(true);
    });
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        ref={selectorRef}
        style={[styles.selector, error && styles.selectorError]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectorText, !selectedOption && styles.selectorPlaceholder]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                top: selectorLayout.y + selectorLayout.height + 4,
                marginHorizontal: spacing.lg,
              }
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  selectorError: {
    borderColor: colors.error,
  },
  selectorText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    flex: 1,
  },
  selectorPlaceholder: {
    color: colors.textTertiary,
  },
  arrow: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    maxHeight: 400,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.primary + '10',
  },
  optionText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  optionTextSelected: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
});
