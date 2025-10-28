import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';

import { PrivateCache, Roles } from '@/common/decorators';
import { Role } from '@/utils/type';
import { AuthGuard, RolesGuard } from '@/common/guards';
import { AddressesService } from './addresses.service';
import {
  AddAddressReqDto,
  AddAddressResDto,
  AddressIdDto,
  DeleteAddressReqDto,
  EditAddressReqDto,
  EditAddressResDto,
  GetAddressesReqDto,
  GetAddressesResDto,
  GetAddressReqDto,
  GetAddressResDto,
} from './dto';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.USER, Role.ADMIN)
@PrivateCache()
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get(':id')
  async getAddressById(
    @Param() dto: GetAddressReqDto,
  ): Promise<GetAddressResDto> {
    return await this.addressesService.getAddressById(dto);
  }

  @Get()
  async getAddresses(
    @Query() dto: GetAddressesReqDto,
  ): Promise<GetAddressesResDto[]> {
    return this.addressesService.getAddresses(dto);
  }

  @Post()
  async addAddress(@Body() dto: AddAddressReqDto): Promise<AddAddressResDto> {
    return this.addressesService.addAddress(dto);
  }

  @Patch(':id')
  editAddress(
    @Param() param: AddressIdDto,
    @Body() dto: EditAddressReqDto,
  ): Promise<EditAddressResDto> {
    return this.addressesService.editAddress(dto, param);
  }

  @Delete(':id')
  async deleteAddress(@Param() dto: DeleteAddressReqDto): Promise<void> {
    return this.addressesService.deleteAddress(dto);
  }
}
