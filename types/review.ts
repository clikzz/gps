import { z } from "zod";
import { createReviewSchema, updateReviewSchema } from "@/server/validations/reviews.validation";

export type Review = {
  id: string;
  service_id: string;
  user_id: string;
  rating: number;
  comment?: string | null;
  created_at: Date;
  updated_at: Date;
};

export type NewReviewFormData = {
  service_id: string;
  rating: number;
  comment?: string | null;
};

export const newReviewFormSchema = createReviewSchema;

export type NewReviewFormInput = z.infer<typeof createReviewSchema>;

export type EditReviewFormData = {
  rating: number;
  comment?: string | null;
};

export const editReviewFormSchema = updateReviewSchema;

export type EditReviewFormInput = z.infer<typeof updateReviewSchema>;

export interface SelectOption {
  value: string | number;
  label: string;
}

export const RATING_OPTIONS: SelectOption[] = [
  { value: 1, label: "⭐ 1 - Muy malo" },
  { value: 2, label: "⭐⭐ 2 - Malo" },
  { value: 3, label: "⭐⭐⭐ 3 - Regular" },
  { value: 4, label: "⭐⭐⭐⭐ 4 - Bueno" },
  { value: 5, label: "⭐⭐⭐⭐⭐ 5 - Excelente" },
];

export const REVIEW_CONSTRAINTS = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  MAX_COMMENT_LENGTH: 500,
} as const;

export interface ReviewWithUser extends Review {
  user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface ReviewWithService extends Review {
  service: {
    id: string;
    name: string;
  };
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number;
  };
}
