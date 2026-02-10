import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import { updateUserProfile } from '@services/firebase/userService';
import { searchUsers } from '@services/firebase/friendService';
import Avatar from '@components/common/Avatar';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { colors, spacing, typography } from '@constants/theme';

type EditProfileNavigationProp = StackNavigationProp<ProfileStackParamList, 'EditProfile'>;

export default function EditProfileScreen() {
  const navigation = useNavigation<EditProfileNavigationProp>();
  const { user, userProfile } = useAuth();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [username, setUsername] = useState(userProfile?.username || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSave = async () => {
    if (!user?.uid || !userProfile) return;

    const newErrors: { [key: string]: string } = {};

    if (!displayName.trim()) {
      newErrors.displayName = 'name is required';
    }

    if (!username.trim()) {
      newErrors.username = 'username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'username must be at least 3 characters';
    } else if (!/^[a-z0-9._]+$/.test(username.trim())) {
      newErrors.username = 'username can only contain lowercase letters, numbers, dots, and underscores';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      // check username uniqueness if changed
      const trimmedUsername = username.trim().toLowerCase();
      if (trimmedUsername !== userProfile.username) {
        const existingUsers = await searchUsers(trimmedUsername);
        const taken = existingUsers.some(
          (u) => u.username === trimmedUsername && u.uid !== user.uid
        );
        if (taken) {
          setErrors({ username: 'username is already taken' });
          setSaving(false);
          return;
        }
      }

      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        username: trimmedUsername,
        bio: bio.trim(),
      });

      Alert.alert('success', 'profile updated!', [
        { text: 'ok', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('error', err.message || 'failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* profile picture */}
        <View style={styles.avatarSection}>
          <Avatar
            uri={userProfile?.photoURL}
            size="xlarge"
            name={userProfile?.displayName}
          />
          <TouchableOpacity
            onPress={() => Alert.alert('coming soon', 'photo upload requires firebase storage (paid plan)')}
            activeOpacity={0.7}
          >
            <Text style={styles.editPictureText}>edit picture</Text>
          </TouchableOpacity>
        </View>

        {/* name */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>name</Text>
          <Input
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="your name"
            error={errors.displayName}
          />
        </View>

        {/* username */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>username</Text>
          <Input
            value={username}
            onChangeText={(text) => setUsername(text.toLowerCase())}
            placeholder="username"
            autoCapitalize="none"
            error={errors.username}
          />
        </View>

        {/* bio */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>bio</Text>
          <Input
            value={bio}
            onChangeText={setBio}
            placeholder="tell people about yourself"
            multiline
            numberOfLines={3}
            error={errors.bio}
          />
        </View>

        {/* save button */}
        <Button
          title="save"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  editPictureText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  fieldSection: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});
