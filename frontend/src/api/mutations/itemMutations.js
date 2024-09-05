import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createItemService,
  deleteItemService,
  updateItemService,
} from "../services/itemServices";

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItemService,

    onError: (err, newItemInfo, rollback) => {
      // Handle error and rollback cache if needed
      // rollback(); // Rollback to previous cache state
    },
    onSuccess: (data, newItemInfo) => {
      queryClient.invalidateQueries(["item"]);
    },
  });
}

//UPDATE hook (put item in api)
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item) => updateItemService(item._id, item),
    onError: (err, newItemInfo, rollback) => {},
    onSuccess: (data) => {
      // Handle success if needed
      // Data here is the response from backend after successful update
    },
  });
}

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItemService,
    onSuccess: () => {
      queryClient.invalidateQueries(["item"]);
    },
  });
};
