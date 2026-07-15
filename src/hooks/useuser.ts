import { useCallback, useEffect, useState } from "react";
import { userRepo } from "../lib/user";
import type { UserProfile } from "../types/user";
import { getErrorMessage } from "../utils/errors";

interface UseUserResult {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/** Load a single user profile by id. */
export function useUser(userId: string | null | undefined): UseUserResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setProfile(await userRepo.getById(userId));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load user"));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { profile, loading, error, reload: () => void load() };
}
