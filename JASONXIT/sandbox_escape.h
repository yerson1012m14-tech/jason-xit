#ifndef SANDBOX_ESCAPE_H
#define SANDBOX_ESCAPE_H

#include <stdint.h>
#include <stdbool.h>
#include <unistd.h>
#include <sys/types.h>

#ifdef __OBJC__
#import <Foundation/Foundation.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

// Declaraciones de funciones requeridas para evitar errores en C99/Clang
uint64_t early_kread64(uint64_t where);
uint32_t early_kread32(uint64_t where);
void early_kwrite64(uint64_t where, uint64_t value);
void early_kwrite32bytes(uint64_t where, void *buf);
uint64_t kread_smrptr(uint64_t where);
uint64_t proc_find_by_name(const char *name);

int perform_sandbox_escape(void);
int elevate_privileges_to_root(void);
int unsandbox_pid(pid_t pid);
int patch_proc_csflags(uint64_t proc_addr);

#ifdef __cplusplus
}
#endif

#endif /* SANDBOX_ESCAPE_H */
