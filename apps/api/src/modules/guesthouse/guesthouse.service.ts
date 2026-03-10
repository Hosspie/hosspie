import { OnboardingStatus } from '@hosspie/database';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateGuesthouseInput, UpdateGuesthouseInput } from './inputs';
import { PrismaService } from '../prisma/prisma.service';

// 📚 참고: https://docs.nestjs.com/providers

@Injectable()
export class GuesthouseService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 온보딩 완료 - 게스트하우스 생성
   */
  async createOnboarding(userId: string, dto: CreateGuesthouseInput) {
    const { rooms, ...guesthouseData } = dto;

    return this.prisma.guesthouse.create({
      data: {
        ...guesthouseData,
        userId,
        onboardingStatus: OnboardingStatus.COMPLETED,
        rooms: {
          create: rooms,
        },
      },
      include: {
        rooms: true,
      },
    });
  }

  /**
   * 사용자의 게스트하우스 조회
   */
  async findByUserId(userId: string) {
    const guesthouse = await this.prisma.guesthouse.findUnique({
      where: { userId },
      include: {
        rooms: true,
      },
    });

    if (!guesthouse) {
      throw new NotFoundException('게스트하우스를 찾을 수 없습니다.');
    }

    return guesthouse;
  }

  /**
   * 게스트하우스 ID로 조회
   */
  async findById(id: string) {
    const guesthouse = await this.prisma.guesthouse.findUnique({
      where: { id },
      include: {
        rooms: true,
      },
    });

    if (!guesthouse) {
      throw new NotFoundException('게스트하우스를 찾을 수 없습니다.');
    }

    return guesthouse;
  }

  /**
   * 게스트하우스 업데이트
   */
  async update(id: string, dto: UpdateGuesthouseInput) {
    const { rooms, ...guesthouseData } = dto;

    // 게스트하우스 존재 확인
    await this.findById(id);

    return this.prisma.$transaction(async (tx) => {
      // 기존 방 삭제 후 새로 생성 (rooms가 제공된 경우)
      if (rooms) {
        await tx.room.deleteMany({
          where: { guesthouseId: id },
        });
      }

      return tx.guesthouse.update({
        where: { id },
        data: {
          ...guesthouseData,
          ...(rooms && {
            rooms: {
              create: rooms,
            },
          }),
        },
        include: {
          rooms: true,
        },
      });
    });
  }

  /**
   * 온보딩 상태 확인
   */
  async checkOnboardingStatus(userId: string) {
    const guesthouse = await this.prisma.guesthouse.findUnique({
      where: { userId },
      select: { onboardingStatus: true },
    });

    return {
      isCompleted: guesthouse?.onboardingStatus === OnboardingStatus.COMPLETED,
    };
  }
}
