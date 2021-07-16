<?php

namespace Wgg\LogviewerBundle\Controller;

use function array_combine;
use function array_merge;
use DateTimeImmutable;
use DateTimeInterface;
use function explode;
use function gzclose;
use function gzopen;
use function gzseek;
use function gztell;
use function is_file;
use function is_readable;
use function mb_substr;
use Pimcore\Bundle\AdminBundle\Controller\AdminController as BaseAdminController;
use Pimcore\Model\User;
use function preg_replace;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;
use function trim;

/**
 * @Route(path="/logviewer", name="wgg_logviewer_")
 */
class AdminController extends BaseAdminController
{
    /**
     * @Route(path="/filelist", name="filelist", defaults={ "format": "json" }, options={ "expose": true })
     */
    public function fileListAction(): JsonResponse
    {
        $this->checkPermission('logviewer.permission');

        return $this->json($this->getFileList());
    }

    private function getFileList(): array
    {
        $files = Finder::create()
            ->in(PIMCORE_LOG_DIRECTORY)
            ->name(['usagelog.log', 'usagelog-archive-*.log.gz']);

        $list = [];

        foreach ($files as $file) {
            $list[] = [
                'status' => 'ok',
                'message' => '',
                'id' => $this->filename2Id($file->getFilename()),
                'text' => $file->getFilename(),
                'filename' => $file->getFilename(),
            ];
        }

        return $list;
    }

    /**
     * @Route(path="/tail/{filename}", name="tail", defaults={ "format": "json" }, options={ "expose": true })
     */
    public function tailAction(Request $request, string $filename): JsonResponse
    {
        $this->checkPermission('logviewer.permission');

        $lastFetchedSize = $request->query->getInt('size', 0);

        return $this->json($this->getNewLines($filename, $lastFetchedSize));
    }

    private function getNewLines(string $filename, int $lastFetchedSize = 0): array
    {
        if (empty($filename)) {
            throw new BadRequestHttpException('File not specified');
        }

        $file = PIMCORE_LOG_DIRECTORY.'/'.$filename;
        if (!is_file($file) || !is_readable($file)) {
            throw new BadRequestHttpException('File not readable');
        }

        $data = [];
        $fp = gzopen($file, 'rb');

        if (false === $fp) {
            throw new BadRequestHttpException('File not readable');
        }

        gzseek($fp, $lastFetchedSize, SEEK_SET);

        for ($i = 0; $i < 100; ++$i) {
            $line = trim(gzgets($fp) ?: '');
            if ('AUTOCREATE' == $line) {
                --$i;
                continue;
            }
            if ($line) {
                $data[] = $this->parseUsagelogLine($line);
            }
        }

        $size = gztell($fp);
        gzclose($fp);

        return [
            'lines' => $data,
            'size' => $size,
        ];
    }

    private function filename2Id(string $filename): string
    {
        return (string) preg_replace('/[^a-z0-9\-]/i', '-', $filename);
    }

    private function parseUsagelogLine(string $line): array
    {
        // \DateTimeInterface::ISO8601 length: 2005-08-15T15:52:01+0000 -> 24 chars
        $date = (new DateTimeImmutable(mb_substr($line, 0, 24)))->format(DateTimeInterface::ATOM);

        /* @see \Pimcore\Bundle\AdminBundle\EventListener\UsageStatisticsListener::logUsageStatistics */
        // remove date and ' : ' from the beginning;
        $data = array_combine([
            'user',
            'controller',
            'route',
            'route_params',
            'params',
        ], explode('|', mb_substr($line, 27)));

        if ($data && $user = User::getById($data['user'])) {
            $data['user'] = $user->getName();
        }

        return array_merge(['date' => $date], $data ?: []);
    }
}
