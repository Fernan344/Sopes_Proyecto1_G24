#include <linux/module.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <linux/sched.h>
#include <linux/uaccess.h>
#include <linux/fs.h>
#include <linux/sysinfo.h>
#include <linux/seq_file.h>
#include <linux/slab.h>
#include <linux/mm.h>
#include <linux/swap.h>
#include <linux/timekeeping.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Aldo Hernandez - Sopes 1 Grupo 24");
MODULE_DESCRIPTION("Modulo que muestra la informacion de ram y cp");
MODULE_VERSION("0.01");

static int my_proc_show(struct seq_file *m, void *v)
{
    //seq_printf(m,"hello from proc file\n");
    seq_printf(m, "%s\n", str);
    return 0;
}

static ssize_t my_proc_write(struct file *file, const char __user *buffer, size_t count, loff_t *f_pos)
{
    return 0;
}

static int my_proc_open(struct inode *inode, struct file *file)
{
    return single_open(file, my_proc_show, NULL);
}

static struct file_operations my_fops = {
    .owner = THIS_MODULE,
    .open = my_proc_open,
    .release = single_release,
    .read = seq_read,
    .llseek = seq_lseek,
    .write = my_proc_write

};

static int __init kernel_module_init_event(void)
{
    struct proc_dir_entry *entry;
    entry = proc_create("helloproc", 0777, NULL, &my_fops);
    if (!entry)
    {
        return -1;
    }
    else
    {
        printk(KERN_INFO "create proc file successfully\n");
    }
    return 0;
}

static void __exit kernel_module_exit_event(void)
{
    remove_proc_entry("helloproc", NULL);
    printk(KERN_INFO "Goodbye world!\n");
}

module_init(kernel_module_init_event);
module_exit(kernel_module_exit_event);