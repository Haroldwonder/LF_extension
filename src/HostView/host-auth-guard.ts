// src/auth/guards/host-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class HostAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check if the user has host role
    // This is a simplified implementation - you'd use your auth service
    if (!request.user || request.user.role !== 'host') {
      throw new UnauthorizedException('Only hosts can access this resource');
    }
    
    return true;
  }
}
