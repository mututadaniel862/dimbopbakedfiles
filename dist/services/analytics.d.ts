import { UserAnalytics } from "../models/analytics";
type DeviceStats = {
    mobile: number;
    tablet: number;
    desktop: number;
    other: number;
    unknown: number;
};
export declare const AnalyticsService: {
    createAnalytics(data: UserAnalytics): Promise<{
        id: number;
        created_at: Date | null;
        user_id: number | null;
        browser: string | null;
        device: string | null;
    }>;
    getAllAnalytics(page?: number, limit?: number, deviceType?: string): Promise<{
        id: number;
        created_at: Date | null;
        user_id: number | null;
        browser: string | null;
        device: string | null;
    }[]>;
    getAnalyticsById(id: number): Promise<({
        users: {
            email: string;
            phone: string | null;
            role: string | null;
            name: string | null;
            username: string | null;
            id: number;
            merchant_name: string | null;
            password_hash: string | null;
            is_active: boolean | null;
            physical_address: string | null;
            geo_latitude: number | null;
            geo_longitude: number | null;
            auth_provider: string;
            google_id: string | null;
            apple_id: string | null;
            facebook_id: string | null;
            last_login: Date | null;
            created_at: Date | null;
            updated_at: Date | null;
            email_verification_token: string | null;
            email_verified: boolean | null;
            login_token: string | null;
            login_token_expires: Date | null;
            password_changed_at: Date | null;
            password_reset_expires: Date | null;
            password_reset_token: string | null;
            refresh_token: string | null;
            refresh_token_expires: Date | null;
        } | null;
    } & {
        id: number;
        created_at: Date | null;
        user_id: number | null;
        browser: string | null;
        device: string | null;
    }) | null>;
    getDeviceTypeStats(): Promise<DeviceStats>;
    getDeviceType(device: string | null): keyof DeviceStats;
};
export {};
