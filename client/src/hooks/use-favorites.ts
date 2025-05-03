import { useState, useEffect } from 'react';
import { Favorite } from '@shared/schema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useFavorites() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // Fetch favorites from API
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['/api/favorites'],
    queryFn: getFavorites,
    onSuccess: (data) => {
      setFavorites(data);
    },
    onError: () => {
      // If API fails, use local storage as fallback
      const storedFavorites = localStorage.getItem('weatherview-favorites');
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites));
        } catch (e) {
          console.error('Failed to parse stored favorites', e);
        }
      }
    }
  });

  // Add favorite mutation
  const addMutation = useMutation({
    mutationFn: apiAddFavorite,
    onSuccess: (data) => {
      setFavorites(prev => [...prev, data]);
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: "Location added to favorites",
        description: `${data.locationName} has been added to your favorites.`,
      });
      // Save to local storage as backup
      localStorage.setItem('weatherview-favorites', JSON.stringify([...favorites, data]));
    },
    onError: (error) => {
      toast({
        title: "Failed to add favorite",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  });

  // Remove favorite mutation
  const removeMutation = useMutation({
    mutationFn: apiRemoveFavorite,
    onSuccess: (_, id) => {
      const removedLocation = favorites.find(f => f.id === id);
      setFavorites(prev => prev.filter(f => f.id !== id));
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: "Location removed from favorites",
        description: removedLocation ? `${removedLocation.locationName} has been removed from your favorites.` : "Location removed",
      });
      // Save to local storage as backup
      localStorage.setItem('weatherview-favorites', JSON.stringify(favorites.filter(f => f.id !== id)));
    },
    onError: (error) => {
      toast({
        title: "Failed to remove favorite",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  });

  // Load favorites from local storage on initial load
  useEffect(() => {
    const storedFavorites = localStorage.getItem('weatherview-favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Failed to parse stored favorites', e);
      }
    }
  }, []);

  const addFavorite = (favorite: Omit<Favorite, "id" | "userId">) => {
    addMutation.mutate(favorite);
  };

  const removeFavorite = (id: number) => {
    removeMutation.mutate(id);
  };

  const isFavorite = (cityId: string) => {
    return favorites.some(f => f.cityId === cityId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    isLoading,
    isError,
    refetch
  };
}
