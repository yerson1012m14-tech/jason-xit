#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN
@interface JASONXITFilzaBridge : NSObject
+ (instancetype)shared;
- (void)prepareFilesystem;
- (BOOL)isContainerManagerAvailable;
- (NSString *)virtualRoot;
- (NSString *)archivePath;
- (nullable NSString *)dataContainerPathForIdentifier:(NSString *)identifier error:(NSString * _Nullable * _Nullable)error;
- (BOOL)pathHasActiveLease:(NSString *)path;
@end
NS_ASSUME_NONNULL_END
