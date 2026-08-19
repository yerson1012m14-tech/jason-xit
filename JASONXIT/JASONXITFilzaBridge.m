#import "JASONXITFilzaBridge.h"
#import "MCMBridge.h"
#import "MCMFilzaIntegration.h"
@implementation JASONXITFilzaBridge
+ (instancetype)shared { static JASONXITFilzaBridge *shared; static dispatch_once_t onceToken; dispatch_once(&onceToken, ^{ shared=[JASONXITFilzaBridge new]; }); return shared; }
- (void)prepareFilesystem { MCMFilzaStart(); }
- (BOOL)isContainerManagerAvailable { return MCMBridgeAvailable(); }
- (NSString *)virtualRoot { return MCMFilzaVirtualRoot(); }
- (NSString *)archivePath { return MCMFilzaArchivePath(); }
- (NSString *)dataContainerPathForIdentifier:(NSString *)identifier error:(NSString **)error { return MCMFilzaDataContainerPath(identifier, error); }
- (BOOL)pathHasActiveLease:(NSString *)path { return MCMFilzaPathHasActiveLease(path); }
@end
