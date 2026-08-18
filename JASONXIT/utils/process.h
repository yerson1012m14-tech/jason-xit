//
//  process.h
//  JASONXIT Process Utilities
//

#ifndef PROCESS_H
#define PROCESS_H

#include <stdint.h>
#include <stdbool.h>
#include <unistd.h>
#include <sys/types.h>
#include "../kexploit/krw.h"
#include "../kexploit/offsets.h"
#include "../kexploit/kutils.h"

#ifdef __cplusplus
extern "C" {
#endif

#ifndef P_DISABLE_ASLR
#define P_DISABLE_ASLR 0x00000004
#endif

int disable_aslr(pid_t pid);
int enable_aslr(pid_t pid);

#ifdef __cplusplus
}
#endif

#endif /* PROCESS_H */
