import { Global, Module } from "@nestjs/common";
import { EvolutionService } from "./evolutions.service";


@Global()
@Module({
    imports: [],
    providers: [EvolutionService],
    exports: [EvolutionService]
})

export class EvolutionModule {};