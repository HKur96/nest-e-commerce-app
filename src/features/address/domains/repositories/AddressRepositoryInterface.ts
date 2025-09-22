import { ApiResponse } from "@/utils/response/api.response";

export interface AddressRepositoryInterface {
    upsertFullLocation() : Promise<ApiResponse>;
}