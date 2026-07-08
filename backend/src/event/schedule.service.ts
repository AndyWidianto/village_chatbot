import { CACHE_RAM_HISTORY_CHAT } from "@/lib/constant/constant-chats";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";


@Injectable()
export class ScheduleService {
    private logger = new Logger();


    @Cron(CronExpression.EVERY_MINUTE)
    handleCheck() {
        this.logger.debug("Testing berhasil dijalankan");
    }
    @Cron(CronExpression.EVERY_10_HOURS) 
    async clearChat() {
        this.logger.log("Membersihkan cattingan......");
        Object.entries(CACHE_RAM_HISTORY_CHAT).forEach(([key, val]) => {
            CACHE_RAM_HISTORY_CHAT[key] = {
                ...val,
                chat: []
            }
        })
    }
}